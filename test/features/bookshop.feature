Feature: List Books using Vue.js UI

  Scenario: Launch cds server for bookshop
    When we run the 'bookshop' server
    And wait for 1s
    Then it should listen at 'http://localhost:4004'

  Scenario: Display Books List
    When we open page '/vue/index.html'
    And wait for 1s
    Then it should list these rows in table 'books':
      | Wuthering Heights | Emily Brontë      |
      | Jane Eyre         | Charlotte Brontë  |
      | The Raven         | Edgar Allen Poe   |
      | Eleonora          | Edgar Allen Poe   |
      | Catweazle         | Richard Carpenter |

  Scenario: Select a Book
    When we click on the 1st row in table 'books'
    Then it shows '12' in 'stock'

  Scenario: Order One Book
    When we click on the 1st row in table 'books'
    And we click on button 'Order:'
    Then it succeeds with 'ordered 1 item(s)'

  Scenario: Order Four Books
    When we enter '4' into 'amount'
    And we click on button 'Order:'
    Then it succeeds with 'ordered 4 item(s)'

  Scenario: Order Amount Exceeding Stock
    When we enter '9' into 'amount'
    And we click on button 'Order:'
    Then it fails with '9 exceeds stock'
