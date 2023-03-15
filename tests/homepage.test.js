const { test, expect } = require('@playwright/test');


test.describe("homepage and room functionality", () => {

  test.describe("homepage room selection", () => {

    test('match room name in url with room name selected on homepage', async ({ page }) => {

      await page.goto('https://chaturbate.com/');
      await page.getByRole('link', { name: 'I AGREE' }).click();

      const randomRoomInteger = Math.floor(Math.random() * await page.locator("#room_list li.room_list_room.roomCard").count());
      const roomName = await page.locator("#room_list li.room_list_room.roomCard").locator('nth=' + randomRoomInteger).locator("div.details div.title a").getAttribute("data-room");

      await page.locator("#room_list li.room_list_room.roomCard").locator('nth=' + randomRoomInteger).click();

      //checks the URL and the previously determined room name match
      await expect(page).toHaveURL("https://chaturbate.com/" + roomName + "/");

    });
  })

  test.describe("room functionality", () => {

    test('verify sign-up, SCAN CAMS, NEXT CAM, SEND TIP buttons and video playing on load ', async ({ page }) => {
      await page.goto('https://chaturbate.com/');
      await page.getByRole('link', { name: 'I AGREE' }).click();
      const randomRoomInteger = Math.floor(Math.random() * await page.locator("#room_list li.room_list_room.roomCard").count());
      await page.locator("#room_list li.room_list_room.roomCard").locator('nth=' + randomRoomInteger).click();

      await expect(page.getByRole('link', { name: 'Sign Up' })).toHaveCount(1);
      await expect(page.getByRole('link', { name: 'SCAN CAMS' })).toHaveCount(1);
      await expect(page.getByRole('link', { name: 'NEXT CAM (Ctrl+/)' })).toHaveCount(1);
      await expect(page.locator('#VideoPanel').getByText('SEND TIP', { exact: true })).toHaveCount(1);

      const videoDiv = await page.locator("div.videoPlayerDiv div.video-js");
      await expect(videoDiv).toHaveClass(/vjs-has-started/);
    });
  })

  test.describe("room functionality -> NEXT Cam", () => {

    test('NEXT CAM behavior', async ({ page }) => {
      await page.goto('https://chaturbate.com/');
      await page.getByRole('link', { name: 'I AGREE' }).click();
      const randomRoomInteger = Math.floor(Math.random() * await page.locator("#room_list li.room_list_room.roomCard").count());
      await page.locator("#room_list li.room_list_room.roomCard").locator('nth=' + randomRoomInteger).click();
      
      let roomName =  await page.locator('h1.bioHeader').textContent();
      await page.getByRole('link', { name: 'NEXT CAM (Ctrl+/)' }).click();
      await expect(page.url()).not.toMatch(roomName);

      roomName = await page.locator('h1.bioHeader').textContent();
      await page.getByRole('link', { name: 'NEXT CAM (Ctrl+/)' }).click();
      await expect(page.url()).not.toMatch(roomName);

      roomName = await page.locator('h1.bioHeader').textContent();
      await page.getByRole('link', { name: 'NEXT CAM (Ctrl+/)' }).click();
      await expect(page.url()).not.toMatch(roomName);

    });
  })
})