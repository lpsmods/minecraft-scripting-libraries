import { GuideBookEntity, GuideBookEntityOptions, TurnPageEntityEvent } from "@lpsmods/mc-utils";

const options: GuideBookEntityOptions = {
  itemId: "book",
  maxPages: 10,
};

class Guide extends GuideBookEntity {
  constructor() {
    super("lpsmods:guide_book", options);
    this.onTurnPage = this.onTurnPage.bind(this);
  }

  onTurnPage(event: TurnPageEntityEvent): void {
    console.warn(`Page ${event.page}`);
  }
}

new Guide();
