color-match
===========

Checks two colors to see how close of a match they are. The goal is to optimize CSS files (i.e. to find "close enough" colors which can just use the same definition).

## Contributing

Contributions are always welcome. Check out the issues page for 

## Measuring Color Differences

Measuring the difference in colors is not as simple as it seems. The best way to accomplish this it to use a Delta E measurement. Rather than repeat what's already written, have a look at these resources if you're interested:

- http://colormine.org/delta-e-calculator/
- http://en.wikipedia.org/wiki/Color_difference

TL;DR; The two color values to compare are converted into a CIE-L*ab format, then passed through a simple formula to measure the difference.
