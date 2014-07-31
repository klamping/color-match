# If you're looking for an actual implementation of this idea, check out: https://github.com/SlexAxton/css-colorguard

No future work is planned for this repo, as colorguard nailed the idea. 

color-match
===========

## What it does (or will do)

Reads through a CSS file, finds all colors, and compares each of them to find close matches. It then reports the close matches.

## Why it does it

The goal is to optimize CSS files (i.e. to find "close enough" colors which can just use the same definition). Basically, to help prevent [designs that have 250+ shades of blue](http://www.slideshare.net/stubbornella/our-best-practices-are-killing-us).

## Contributing

Contributions are always welcome. Check out the issues page for 

## Measuring Color Differences

Measuring the difference in colors is not as simple as it seems. The best way to accomplish this it to use a Delta E measurement. Rather than repeat what's already written, have a look at these resources if you're interested:

- http://colormine.org/delta-e-calculator/
- http://en.wikipedia.org/wiki/Color_difference

TL;DR; The two color values to compare are converted into a CIE-L*ab format, then passed through a simple formula to measure the difference.
