# Farmer profile photo

Place the profile photo prepared by the application owner at
`public/images/profile/farmer-profile.jpg`.

The same image path is used by the profile button in the header and the farmer
profile modal. A square JPG image gives the best circular avatar crop. Until
the file is added, the interface falls back to the existing neutral user icon.

Do not store Aadhaar scans, ID document photos, or other sensitive identity
documents in this public folder. The profile fields in this PR are demo-only
and are saved in the browser's local storage. No official ID verification is
performed by the frontend.
