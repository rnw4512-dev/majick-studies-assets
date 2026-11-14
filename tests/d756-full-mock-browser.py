"""Full guided mock meeting regression in isolated browser profiles."""
import os
from playwright.sync_api import sync_playwright
URL = os.environ.get("MAJICK_URL", "http://127.0.0.1:8765/")
with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path=os.environ.get("CHROMIUM_PATH", "/usr/bin/google-chrome"), args=["--no-sandbox"])
    for width in (390, 820, 1366):
        context = browser.new_context(viewport={"width": width, "height": 850})
        page = context.new_page()
        errors = []
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        page.goto(URL)
        page.wait_for_function("!!window.MajickD756Meeting && !!window.MajickRewardCore")
        page.evaluate('switchCourse("D756")')
        page.evaluate("MajickD756Meeting.open()")
        room = page.locator("#d756MeetingRoom")
        room.locator("#dmMode").select_option("mock")
        room.locator('[data-action="start"]').click()
        assert room.locator(".dmMockGuide").count() == 1, "Full mock guide not visible"
        assert "STEP 1/12" in room.locator(".dmMockGuide").inner_text()
        assert room.locator(".dmReferenceQuick").count() == 1
        assert room.locator(".dmGoalCard").count() == 3
        assert room.locator('[data-action="hear"]').count() == 1
        assert room.locator('[data-mock-model]').count() == 1
        room.locator('[data-mock-model]').click()
        assert len(room.locator("#dmAnswer").input_value()) > 40
        state = page.evaluate('JSON.parse(localStorage.getItem("majick-d756-task2-rehearsal-v1"))')
        assert state["fullMock"] is True and state["mode"] == "guided"
        assert state["assistedStage"] is True
        room.locator('[data-action="submit"]').click()
        assert room.locator(".dmLearningFeedback").count() == 1
        assert "Why this matters in the lesson" in room.locator(".dmLearningFeedback").inner_text()
        assert "Specific next improvement" in room.locator(".dmLearningFeedback").inner_text()
        assert room.locator(".dmCoachDetails").count() == 1
        evidence = room.locator(".dmCoachEvidence")
        assert "Team greeting" in evidence.inner_text()
        assert "Found:" in evidence.inner_text(), "Feedback must quote the learner's submitted words"
        coach = room.locator(".dmCoachDetails")
        assert coach.get_attribute("open") is not None
        coach.locator(":scope > summary").click()
        assert coach.get_attribute("open") is None, "Feedback did not collapse"
        coach.locator(":scope > summary").click()
        assert coach.get_attribute("open") is not None, "Feedback did not expand"
        feedback_ink = room.locator(".dmCoachDetails > ul:not(.dmCoachEvidence) li").first.evaluate("(el)=>getComputedStyle(el).color")
        assert feedback_ink in ("rgb(48, 37, 56)", "rgb(40, 29, 48)", "rgb(53, 40, 62)"), feedback_ink
        assert room.locator('[data-action=guide-next]').is_visible()
        state = page.evaluate('JSON.parse(localStorage.getItem("majick-d756-task2-rehearsal-v1"))')
        assert state["records"][-1]["assisted"] is True
        # Rewrite practice is not a new stakeholder turn or a new reward.
        original_count = len(state["records"])
        original_answer = state["records"][-1]["answer"]
        room.locator('[data-action=revise-last]').click()
        assert "does not" in room.locator(".dmRevisionBox").inner_text()
        room.locator("#dmRevision").fill("Thank you for joining us today. We will review Angela's strengths, learning needs, measurable goals, transition plans, and invite Elena's concerns.")
        room.locator('[data-action=revision-submit]').click()
        checked = page.evaluate('JSON.parse(localStorage.getItem("majick-d756-task2-rehearsal-v1"))')
        assert len(checked["records"]) == original_count
        assert checked["records"][-1]["answer"] == original_answer
        assert checked["records"][-1].get("revisions"), "Practice rewrite not retained"
        room.locator('[data-action=feedback-dismiss]').click()
        room.locator('[data-action=undo-turn]').click()
        undone = page.evaluate('JSON.parse(localStorage.getItem("majick-d756-task2-rehearsal-v1"))')
        assert len(undone["records"]) == original_count - 1, "Undo created another response"
        room.locator('[data-action=redo-turn]').click()
        redone = page.evaluate('JSON.parse(localStorage.getItem("majick-d756-task2-rehearsal-v1"))')
        assert len(redone["records"]) == original_count
        assert redone["records"][-1]["answer"] == original_answer
        room.locator('[data-action=council-help]').click()
        assert page.locator('#aetheriaHelpDialog').count() == 1
        assert "Undo last response" in page.locator('#aetheriaHelpDialog').inner_text()
        page.locator('#aetheriaHelpDialog [data-help-close]').first.click()
        assert page.locator('#aetheriaHelpDialog').count() == 0
        assert room.locator(".dmPanel [data-action=close]").is_visible()
        # New rehearsal: explicitly address the teacher while also mentioning Angela.
        # The speaker must be Mr. Moore, not Angela or student-voiced wording.
        room.locator('[data-action=close]').click()
        page.evaluate('MajickD756Meeting.open()')
        room.locator('[data-action=reset]').click() if room.locator('[data-action=reset]').count() else None
        room.locator('#dmMode').select_option('guided')
        room.locator('[data-action=start]').click()
        room.locator('#dmAnswer').fill("Mr. Moore, what have you noticed about Angela's writing in class? I would like your specific observations to inform our measurable IEP goals.")
        room.locator('[data-action=submit]').click()
        speaker_name = room.locator('.dmPrompt b').inner_text()
        assert 'Moore' in speaker_name, "Teacher question was assigned to the wrong speaking character: " + speaker_name
        assert not errors, errors
        room.locator('[data-action="close"]').click()
        context.close()
        print(f"PASS full mock: guide, voice button, model-assisted state, readable coach at {width}px")
    browser.close()
