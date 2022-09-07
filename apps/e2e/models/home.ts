import BasePage from "./base";

export default class HomePage extends BasePage {
  override navigate() {
    return this.page.goto("/");
  }
}
