/* eslint-disable @typescript-eslint/no-explicit-any */
import getPageName from "./getPageName";

describe("getPage utility test group", () => {
  let savedDocument: Document;
  beforeAll(() => {
    savedDocument = (global.window as any)._document;
  });
  afterAll(() => {
    (global.window as any)._document = savedDocument;
  });

  it.each([
    ["/inside/student/tasks/", "tasks"],
    ["/inside/student/marks/", "marks"],
    ["/inside/student/materials/", "materials"],
    ["/inside/student/reports/", "reports"],
    ["/inside/student/profile/", "profile"]
  ])("document pathname: %s, page: %s", (pathname: string, page: string) => {
    (global.window as any)._document = {
      location: { pathname }
    };
    expect(getPageName()).toBe(page);
  });
});
