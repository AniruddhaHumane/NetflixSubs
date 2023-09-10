# NetflixSubs
Automatically Searches for Subs in your local directory and adds them to Netflix. 

## Requirements
Existing downloaded subtitles:

> Note that the subs should have the following format (Episodenumber.ass) e.g. 234.ass

Python 3

https://github.com/SubtitleEdit/subtitleedit/releases

## Installation
1. Download a zip of subtitles and extract them 
2. Clone this repository
3. Copy `setup.py` to the folder that has all the subs
4. run setup.py (double click!)
5. Go to Chrome's extensions page
6. click on load unpacked
7. select the directory of this repository
8. Adjust the delay in subtitles by using extension options
9. Enjoy the subs!

### Instructions

- Allows users to fetch subs from their local directory and show them on Netflix.
- Set path inside `server.py` and that's it. 

- You can also create a shortcut on the desktop with respective paths to run it quickly.
- Even better to keep it in windows startup or crontab!

## Adjust subs
1. Install SubtitleEdit
2. Tools -> Batch Convert
3. Load all subs
4. Offset time codes
5. set your offset for subs
6. convert all subs!

# Notes
- You have to keep the server.py running to see subs
- If for any reason browser storage doesn't work or gives any errors try refreshing the page! (ctrl+r or ctrl+shift+r)
- create an issue for any error listed in console logs that are not resolved after refreshing!

### <i>Happy Subs!!</i>
