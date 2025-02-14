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
    - Answer = b