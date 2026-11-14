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
        state = page.evaluate('JSON.parse(localStorage.getItem("majick-d756-task2-rehearsal-v1"))')
        assert state["records"][-1]["assisted"] is True
        text_color = room.locator(".dmLearningFeedback li").first.evaluate("(el)=>getComputedStyle(el).color")
        assert text_color in ("rgb(48, 37, 56)", "rgb(40, 29, 48)"), text_color
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
