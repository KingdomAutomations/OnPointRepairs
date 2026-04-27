ON POINT REPAIRS OPTIMIZED SITE PACKAGE

What changed:
- Rebuilt the homepage flow so it moves naturally: hero, process, common services, travel estimator, trust points, page paths, booking CTA.
- Removed client-facing/internal copy and awkward language.
- Reduced dead space by tightening hero height, section padding, page hero height, and repeated CTA areas.
- Kept the repair-first positioning while preserving the $25 mobile check logic.
- Cleaned page copy across Services, Diagnostics, RI Inspection Help, Fleets, About, and Book.
- Kept Google Calendar booking embedded on contact.html.
- Kept the driving-distance calculator on the homepage and booking page.
- Kept pricing as starting points and quote-before-work language throughout.

Deploy:
1. Upload the full folder contents to Netlify, Vercel, or your web host.
2. Keep the same file names and the assets folder together.
3. Replace placeholder contact details when ready.
4. The duplicate website contact form was removed. Google Appointment Scheduling is now the main customer intake.
5. The distance calculator uses public map services. For heavier usage, move geocoding/routing behind a serverless function or paid Maps API.


Privacy update:
- Removed the residential dispatch address from public copy and frontend JavaScript.
- The distance calculator now uses a generic Providence service-area reference point instead of exposing a private address.
- For exact routing without exposing the origin, move distance calculation behind a serverless function.

Latest update:
- Removed the duplicate website intake/contact form from contact.html.
- Kept the distance calculator before the embedded Google appointment calendar.
- Updated booking copy so the Google appointment questions are the primary customer intake.
- Added a short three-step explanation: Check Travel, Book In Google, Confirm Scope.

Latest update:
- Added a Book Now button at the bottom of the distance calculator that jumps directly to the Google appointment form.
- Updated pre-purchase wording to "$50 Working Diagnostic • $125 Maintenance Report" across the site and calculators.

Latest cleanup:
- Removed repeated $25 mobile check messaging from the first viewport.
- Topbar now reinforces the brand promise instead of repeating the offer.
- Header CTA is now Book Service.
- Homepage hero CTA is now Get Help With Your Car.
- Kept the distance calculator and booking flow intact.

Latest update:
- Header Book Service button is hidden above the fold and appears after scrolling so the hero is not overloaded with repeated booking CTAs.
- Homepage hero primary CTA restored to 'Book $25 Mobile Check'.

Service accordion update:
- Homepage service cards now link to exact service sections on services.html.
- The services page now uses expandable service descriptions instead of a static pricing-only table.
- Direct links like services.html#service-brakes, #service-suspension, #service-nostart, #service-ac, #service-inspection, and #service-ppi automatically open the matching service section.
- Every expanded service section includes a Book Now button linking to the booking page.

Latest update:
- Removed the duplicate top Core Repairs card grid from services.html.
- Services now flow from the page hero directly into the expandable service detail menu.
- Existing homepage links still open the matching expanded service detail with a Book Now button.

Latest cleanup:
- Removed visible OPEN/CLOSE wording from the service detail rows.
- Replaced it with a cleaner Click For Details cue.
- Moved service pricing into the expanded detail area directly above each Book Now button.
