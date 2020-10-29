describe("Pokemon List", () => {
  it("Go to Pokemon Details", () => {
    cy.visit("http://localhost:3000/home/pokemon");
    cy.contains("ivysaur").click();
    cy.url().should("include", "/pokemon-dets");
  });
  it("Catch and Release on Success", () => {
    cy.get("button#catchBtn").click();
    cy.get(".modal").then((modal) => {
      if (modal.find("input#nickName").length > 0) {
        cy.get("input#nickName")
          .focus()
          .clear()
          .type("ivy")
          .should("have.value", "ivy");
        cy.get("button#saveCatchBtn").click();
        cy.url().should("include", "/my-pokemon");

        if (cy.get("button").contains("Release")) {
          cy.get("button").contains("Release").click();
          cy.get("button#confirmBtn").click();
          cy.url().should("include", "/my-pokemon");
        }
      } /*else if ($modal.find("button#tryAgainBtn").length > 0) {
        cy.get("button#tryAgainBtn").click();
      }*/
    });
  });
});
