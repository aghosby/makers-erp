Add a new icon to the project icon list.

The argument format is: `iconName <svg-path-string>`
- The first word is the camelCase icon name (e.g. `arrowRight`, `userCircle`)
- Everything after the first word is the raw SVG path markup (one or more `<path>` elements)

Arguments: $ARGUMENTS

Steps:
1. Parse the arguments: the icon name is the first whitespace-delimited token; the SVG content is everything after it.
2. Read the file `src/app/core/constants/icons.ts`.
3. Add the new icon entry using this exact format (note the backtick template literal and a trailing comma):
   ```
       iconName: `<path ...>`,
   ```
4. Insert it in alphabetical order among the existing keys.
5. Make sure `fill="inherit"` is present on every `<path>` element in the SVG content — if it is missing, add it.
6. Write the updated file.
7. Confirm which icon was added and show the final entry.
