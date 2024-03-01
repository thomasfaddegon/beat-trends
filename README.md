NOTES

Used React for the legend since it felt easier than adding a legend through D3.

Added hover evnet listeners using d3 that increase stroke width.

Add invisible wider path
Another approach is to add an invisible, wider version of the line behind the visible one, serving as the target for hover interactions. This invisible line can have a much wider stroke-width but be fully transparent or match the background, making it easier to hover over without visually altering the graph.

Struggled with dots and getting the line hover effects to work. when going from circle to line or line to circle, the mouse off event from one would cancel out the mouseover from the other. Basically couldn't get the line hover to work when hovering over the circle.

Was able to fix it by using flags isLineHovered and isCircleHovered and then slightly dealying the mouseout event for the circle to give the flag time to change, and then checking to see if the flag was true and the cursor was still over the line.

The final problem was if two circle were overlapped, then the mouseout event for the first line would not trigger, causing multiple lines to be highlighted.
