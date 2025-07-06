


/*

TEXTBOX:

using only javascript, not react:
horizontally and vertically outlined centered canvas with 25 by 25 box filled with mono spaced vertically centered dashes (constant x and y) that are above underline cursor that moves left, right, up, down and cursor stops on left at first character, right at last character, top, and bottom.  Rightmost character wraps to leftmost next row. The cursor is a line that displays beneath the characters (not on top of them at all and doesn't blink) with modular styling.  border outlines changing text box.  make characters print on the grid and make working functions for regular keypress that inserts and moves all characters to the right, when delete key is pressed, deletes character left of cursor, moves cursor left, and moves all characters on all rows left - last character is filled in with dash. Checks if word starts anywhere on row and spans over right border with next row delete, and insert on word with word spanning any word right edge. When cursor moves up from first row goes to last row, when cursor goes down from last row goes to top row.  Both uppercase and lowercase characters are above cursor,  characters are 1px higher than cursor.   main file is script.js.  The cells are 19px vertical by 12px horizontal.


create move cursor:  on left edge and go left, go to rightmost edge.  On right edge and go right, go to left edge.  On top and go up, go to lowest row, on lowest edge and go down go to top row. 





PUSH ALL WRAPPED TEXT :



do the following in order like a program:

For each row except the last:

Start at the leftmost character (col = 0) and check if there's a consecutive word (letters only) that reaches the right edge or there is only one character at last character .  If consecutive word is greater than 5 go to next row and rerun this statement.

If not, move the starting point one column to the right and go to statement above.

If such a word is found and:

The next row has a character starting at the first row, then:
insert the consecutive word to the left of the next row and put dashes on row above, where upper word was.








do the following in order like a program:

For each row except the last:

Start at the leftmost character (col = 0) and check if there's a consecutive word (letters only) that reaches the right edge or there is only one character at last character .

If not, move the starting point one column to the right and go to statement above.

If such a word is found and the consecutive word is less than total row length:

The next row has a character starting at the first row, then:
insert the consecutive word to the left of the next row and put dashes on row above, where upper word was.



*/

