"""Exercise the whole-course assessment and its durable checkpoints in Chromium."""
import os
import sys
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import expect, sync_playwright


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


root = Path(sys.argv[1] if len(sys.argv) > 1 else 'current-site').resolve()
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(root)))
threading.Thread(target=server.serve_forever, daemon=True).start()
url = os.environ.get('MAJICK_URL', f'http://127.0.0.1:{server.server_port}/')
courses = sys.argv[2:] or ['D669', 'D772', 'D755', 'D756']


def open_assessment(page, course, via_observatory=False):
    page.wait_for_function('!!window.MajickCourseLearningPath && !!window.MajickRewardCore && !!window.MajickStudyProgress')
    page.evaluate("(id)=>{if(S.activeCourse!==id)switchCourse(id);navigate('learninglab')}", course)
    selector = '[data-obs-assessment]' if via_observatory else '#hubWholeCourse'
    page.locator(selector).click()
    return page.locator('#learnPractice')


def checkpoint(page, course):
    return page.evaluate("""id=>({
        session:S.majickLearningLab[id].wholeCourseAssessment,
        answers:(S.progress[id].answers||[]).filter(a=>a.source==='guided-independent-retry'),
        ledger:S.majickAccount.rewardCore.ledger,
        xp:S.majickAccount.xp, crystals:S.majickAccount.crystals
    })""", course)


def reload_assessment(page, course):
    page.evaluate('MajickSaveSafety.flush()')
    before = checkpoint(page, course)
    page.reload(wait_until='domcontentloaded')
    panel = open_assessment(page, course, via_observatory=True)
    assert checkpoint(page, course) == before, 'Reload changed the assessment, course answers or earned rewards'
    return panel


def reveal_ready_guardians(page):
    while page.locator('#majHatchReveal').count():
        page.locator('#majHatchReveal').click()
        page.locator('#majHatchContinue').click()


with sync_playwright() as pw:
    browser = pw.chromium.launch(
        executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'),
        args=['--no-sandbox'],
    )
    for course in courses:
        context = browser.new_context(reduced_motion='reduce')
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(url, wait_until='domcontentloaded')
        panel = open_assessment(page, course)
        seen = set()
        for number in range(50):
            if course == 'D669' and number == 1:
                panel = reload_assessment(page, course)
            expect(panel.locator('progress')).to_have_attribute('value', str(number))
            question = page.evaluate('id=>S.majickLearningLab[id].wholeCourseAssessment.question', course)
            qid = question.get('id') or question.get('qid') or question['prompt']
            assert qid not in seen, qid
            seen.add(qid)
            choices = panel.locator('[data-guide-index]')
            assert choices.count() == len(question['options'])
            answer = question['answer']
            correct_index = answer if isinstance(answer, int) else question['options'].index(answer)
            wrong = number % 5 == 0
            chosen = (correct_index + 1) % choices.count() if wrong else correct_index
            if wrong:
                balances = page.evaluate('({xp:S.majickAccount.xp,crystals:S.majickAccount.crystals})')
            choices.nth(chosen).click()
            if wrong:
                assert page.evaluate('({xp:S.majickAccount.xp,crystals:S.majickAccount.crystals})') == balances
            expected = 'review needed' if wrong else 'Independent correct'
            expect(panel.locator('#guidedFeedback')).to_contain_text(expected)
            reveal_ready_guardians(page)
            if course == 'D669' and number == 2:
                panel = reload_assessment(page, course)
                expect(panel.locator('#guidedFeedback')).to_contain_text(expected)
                expect(choices.nth(chosen)).to_be_disabled()
                expect(choices.nth(chosen)).to_have_attribute('aria-pressed', 'true')
            panel.locator('#wholeNext').click()
            if number in (9, 19, 29, 39):
                expect(panel.locator('.wholeBrainBreak')).to_be_visible()
                if number == 9:
                    for rune in range(3):
                        round_state = checkpoint(page, course)['session']['brain']
                        term = round_state['rounds'][rune]['term']
                        panel.get_by_role('button', name='✧ '+term, exact=True).click()
                        expect(panel.locator('#wholeBreakFeedback')).to_contain_text('Correct!')
                        if course == 'D669' and rune == 0:
                            panel = reload_assessment(page, course)
                            expect(panel.locator('#wholeBreakFeedback')).to_contain_text('Correct!')
                        panel.locator('#wholeBreakNext').click()
                else:
                    panel.locator('#wholeBreakSkip').click()
        expect(panel.locator('.wholeQuestResult')).to_contain_text('40 / 50 correct')
        evidence = checkpoint(page, course)
        attempts = evidence['answers']
        assert len(attempts) == 50 and sum(a['correct'] for a in attempts) == 40
        assert len([r for r in evidence['ledger'].values() if r['type'] == 'whole-course-complete']) == 1
        summary = page.evaluate('id=>MajickStudyObservatory.summary(id).assessment', course)
        assert summary['latest']['correct'] == 40 and summary['latest']['total'] == 50
        assert summary['latest']['independent'] and not summary['inProgress']
        if course in ('D772', 'D756'):
            assert len(summary['latest']['sections']) >= 3
        if course == 'D669':
            panel = reload_assessment(page, course)
            expect(panel.locator('.wholeQuestResult')).to_contain_text('40 / 50 correct')
        assert not errors, errors
        print(f'PASS {course}: 50 distinct items, four Rune Match breaks, 40/50, saved answers and one completion reward', flush=True)
        context.close()
    browser.close()
