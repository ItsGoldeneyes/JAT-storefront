# Feb 14 Notes


## Assignment

- Database diagram as UML Diagram (Lucidchart)
  - Class diagram required, can do other types as well
- Explain database usage for each feature
- Layered Architecture
  - Presentation layer, business layer (?), data layer
- Map display
  - Google Maps API
  - Markers on the map for source, destination, and path
- Application Architecture
  - System Architecture
    - Presentation/Business/Data layer
    - Details about content of layers
    - MVC Diagram?
  - Database Architecture
    - Screenshots from phpmyadmin (prob dbgate for us)
Optional:
- Preferred store select to change the source location for path
- Images not too big, just don't make shit design
- Drag and drop item to shopping cart (feels like bad design? She liked it)
- Password security doesn't matter, so probably don't actually have to do real payment system
- Good design
  - Images not too big
  - Good homepage with navbar, title, login

## submission instructions
- readme.txt -> for special instructions running project
- zip all required files including images sounds to execute project
- one submission per team
- Team_21\_Sec\_02

iter 1 (client side)
- 3 services -> shopping (find best deal for item and add to cart), delivery (find optimum path from selected/closest warehouse to destination), payment (review/accept invoice and process payment through safest way)
- each page -> has navbar with 'home' 'system logo' 'about us' 'sign up' 'sign in' 'reviews' 'shopping cart' 'types of services'
- home -> shopping from selected department (only one), delivery to destination from selected branch (requested at same time), payment after invoice (assume only credit card payment)
- system logo -> name/small image 
- reviews -> no need to implement rn
- workflow -> show available items and prices, user signs up/in, user adds items to cart, user selects items in cart, user selects branch location and datetime for delivery, show invoice and path on map from selected branch to destination, user reviews/accepts invoice and pays, define truck for delivery, complete order with message to user on page
- about us -> names and contact of team members, small bio and photo
- shopping cart -> items saved using drag and drop
- sign up -> id (username), password, name, tel no, mailing address, email
- should work on at least 3 diff browsers -> firefox, chrome, selected

iter 2 (server side)
- order table -> id, date issued, date received, total price, payment code, user id, trip id, receipt id
- item table -> id, item name, price, made in, department code
- user table -> id, name, tel no, email, address, city code, login id, password, balance
- trip table -> id, source code, destination code, distance (km), truck id, price
- truck table -> id, truck code, availability code
- shopping table -> receipt id, store code, total price
- database should be created on service side, accessed through mysql and xampp
- combine code from iter 1 with php scripts -> extract common headers into separate include files and include in php files
- create tables, define relation among tables, add more if required, generalize database retrieval code through separate classes, tables should be related based on numeric codes
- each image/info in dropdown menus must be linked with appropriate query string 
- use proper keys (numeric ids) to access (CRUD or whatever) tables
- add search to main page -> brings system to search mode, search dialogue box display at top right of page, can search for specific order using user id or order id if order is done ?, display results 
- add db maintain to main page -> brings system to database maintain mode, drop down list appear with options 'insert' 'delete' 'select' 'update', each option opens new page with dialogue boxes to get required parameters, this option should only be used by database admin

ta demo
- multipages designed in frontend, tables created with values in backend, sql queries can perform between front and back end using xampp, shopping cart and maps display and work, etc.

report
- cover page -> course title, project title, team#, name, student id, table of tasks and percentage of tasks done by each person
- describe project objectives, languages/tech used
- draw/screenshot? all UI
- draw/screenshot? case study schema of database -> including name of tables, fields, primary keys, table relationships
- draw/screenshot? class diagram of web app design (class relationships) -> indicate how you applied MVC pattern

## Midterm

### Question topics
- HTML, forms
- CSS Stylesheet
  - How to target elements on page/change them
- JS Code
  - "The way you can code it and different functions"
  - Get element by id
  - manage form of object on screen using SJ functions
- Questions about handlers in Drag N Drop
- PHP Code and Classes
  - How to define classes
    - Call different parts in order to do interactions
  - Layered architecture
  - MVC Design
  - Embedded code in MYSQL inside of PHP code

### Sample questions
  - What is the value of X after running program?
```php
$a=0;
while ($a++)
{ echo "$a";}
else {echo $a;}
```

    - is answer 0, 1, 01, None of above
    - Answer = B


  - What is the output of following code?
```php
$a = 10;
echo 'Value of a = $a';
```

    - is answer Value of a = 10, Value of a = $a, undefined, Syntax error
    - Answer = a 


    - What is the output of following code?
```php
$Rent=250;
function Expenses($Other) 
{$Rent = 250 + $Other;
return $Rent;}
Expensses(50);
```

    - Is answer 300, 250, 200, Compile error
    - Answer = A
    - EVEN THOUGH it's a global variable, it can be referenced in the function and updated