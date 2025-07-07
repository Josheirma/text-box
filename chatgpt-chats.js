


/*

TEXTBOX: (chatGPT: Canvas Text Grid Cursor)

using only javascript, not react:
horizontally and vertically outlined centered canvas with 25 by 25 box filled with mono spaced vertically centered dashes (constant x and y) that are above underline cursor that moves left, right, up, down and cursor stops on left at first character, right at last character, top, and bottom.  Rightmost character wraps to leftmost next row. The cursor is a line that displays beneath the characters (not on top of them at all and doesn't blink) with modular styling.  border outlines changing text box.  make characters print on the grid and make working functions for regular keypress that inserts and moves all characters to the right, when delete key is pressed, deletes character left of cursor, moves cursor left, and moves all characters on all rows left - last character is filled in with dash. Checks if word starts anywhere on row and spans over right border with next row delete, and insert on word with word spanning any word right edge. When cursor moves up from first row goes to last row, when cursor goes down from last row goes to top row.  Both uppercase and lowercase characters are above cursor,  characters are 1px higher than cursor.   main file is script.js.  The cells are 19px vertical by 12px horizontal.

-->  changed move cursor





PUSH ALL WRAPPED TEXT (obsolete):

do the following in order like a program:

For each row except the last:

Start at the leftmost character (col = 0) and check if there's a consecutive word (letters only) that reaches the right edge or there is only one character at last character .

If not, move the starting point one column to the right and go to statement above.

If such a word is found and the consecutive word is less than total row length:

The next row has a character starting at the first row, then:
insert the consecutive word to the left of the next row and put dashes on row above, where upper word was.




PUSH TEXT TO NEXT ROW IF ROOM WITH NO INSERTING: (chatGPT: Word Wrapping Algorithm)

Start at the leftmost character (col = 0) and check if there's a consecutive word (letters only) that reaches the right edge or there is only one character at last character and a left most character on next row. 


If not, move the starting point one column to the right and go to statement above.


If there is a consecutive word and its length is less than the consecutive spaces after consecutive leftmost characters on next row and there is a non-space character on next rows first column:

insert the row's rightmost word in to the next row so that it only inserts into whitespace after next row's left most consecutive characters.
 
make great comments


ENTER: (chatGPT: Canvas Text Grid Cursor)

if enter is pressed, text at cursor to the right most character is inserted between row and next row.  The rest of the row is filled with spaces.


*/

