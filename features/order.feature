Feature: Place an order

  Scenario: Place an order
    Given Login as a registered user
    When Add items to cart
    Then Verify order summary
    When Place the order
    Then Verify order submission

