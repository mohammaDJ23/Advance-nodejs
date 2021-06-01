const Page = require("./helper/page");

let page;

// run this code before any test

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

// run this code after each test

afterEach(async () => {
  await page.close();
});

test("the header has correct text", async () => {
  const blogHeaderText = await page.getContentOf("a.brand-logo");

  expect(blogHeaderText).toEqual("Blogster");
});

test("clicking login starts oauth flow", async () => {
  await page.click(".right a");
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test("when signed in, shows logout button", async () => {
  await page.login();

  const logoutText = await page.getContentOf('a[href="/auth/logout"]');

  expect(logoutText).toEqual("Logout");
});
