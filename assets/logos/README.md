# How to add your logos

Place your logo image files in this folder, then update `index.html`.

## College logo (NITTE / NMAM-IT)

1. Copy your college logo file here, e.g. `nmamit-logo.png`
2. Open `index.html` and find the comment:
   ```
   <!-- COLLEGE LOGO: replace the .logo-box div below with an <img> tag -->
   ```
3. Replace:
   ```html
   <div class="logo-box">N</div>
   ```
   with:
   ```html
   <img src="assets/logos/nmamit-logo.png" alt="NMAM Institute of Technology" class="logo-img" />
   ```

## Club logos (Finite Loop / HerQuest)

1. Copy your club logo files here, e.g. `finite-loop-logo.png` and `herquest-logo.png`
2. Open `index.html` and find the comment:
   ```
   <!-- CLUB LOGOS: replace emoji icons below with <img> tags -->
   ```
3. For HerQuest, replace:
   ```html
   <div class="badge-icon">💗</div>
   ```
   with:
   ```html
   <div class="badge-icon"><img src="assets/logos/herquest-logo.png" alt="HerQuest" /></div>
   ```
4. For Finite Loop, replace:
   ```html
   <div class="finite-loop">Finite Loop</div>
   ```
   with:
   ```html
   <img src="assets/logos/finite-loop-logo.png" alt="Finite Loop" class="logo-img" style="height:40px;" />
   ```

## Recommended image formats
- PNG with transparent background (best)
- SVG (scalable, perfect quality)
- JPG (works but no transparency)

## Recommended sizes
- College logo: ~200×60 px minimum
- Club logos: at least 80×80 px (shown as 38×38 px circles)
