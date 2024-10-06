# Host Your Own OCPxS (Outlook iCalendar Proxy Service)

OCPxS is a service designed to proxy Office365 Outlook iCS link to remove CORS restriction.

OCPxS is written in Go and can run on Linux/macOS/Windows.

Make sure you have Go1.23.1+ installed.

1. cd into the [outlookICalProxy](../outlookICalProxy/) directory.
2. If you use macOS/Linux/Unix, run `bash build.sh`. If you use Windows, run `build.bat`.
3. The compiled binary will be in the `out` directory.
4. Copy `config.example.json` to `./out/config.json` and edit it.
5. Use `./out/outlookICalProxy` to run the service.

Once you run the service, you just replace original ICS link's begining' `https://outlook.office.com/` to your server's address. (e.g. `https://outlook.office.com/efwccew/fewcwecw/calendar.ics` to `https://ical.kevinzonda.com/efwccew/fewcwecw/calendar.ics`)