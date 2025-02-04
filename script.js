// Register GSAP's ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Select DOM elements
const container = document.querySelector(".container");
const leftColumn = document.querySelector("#leftColumn");
const rightColumn = document.querySelector("#rightColumn");
const slides = document.querySelectorAll(".left-column .slide");
const totalSlides = slides.length;

// Assume totalOffset is defined as (totalSlides - 1)
const totalOffset = totalSlides - 1;
// Choose your threshold multiplier (0.1 means if you go 10% past the lower snap, we jump to the next slide)
const thresholdMultiplier = 0.08;

// We'll store the last progress value to detect direction.
let lastProgress = 0;

const customSnap = (progress) => {
  const increment = 1 / totalOffset;

  // Prevent snapping when progress is very low (e.g. less than 20% of one slide)
  if (progress < increment * 0.1) {
    return 0;
  }

  // Compute the lower and upper snap points
  const lowerSnap = Math.floor(progress / increment) * increment;
  const upperSnap = Math.ceil(progress / increment) * increment;

  // Determine scroll direction by comparing with the last progress.
  const direction = progress - lastProgress;
  lastProgress = progress;

  // When scrolling down, if the progress has exceeded (lowerSnap + threshold), snap up.
  if (direction > 0) {
    if (progress - lowerSnap >= increment * thresholdMultiplier) {
      return upperSnap;
    } else {
      return lowerSnap;
    }
  }
  // When scrolling up, if the progress is more than (upperSnap - threshold) away from the upper, snap down.
  else if (direction < 0) {
    if (upperSnap - progress >= increment * thresholdMultiplier) {
      return lowerSnap;
    } else {
      return upperSnap;
    }
  }
  return lowerSnap;
};

// Pre-position the right column so that its bottom slide is initially visible.
// We do this by moving it upward by the total offset.
gsap.set(rightColumn, { y: `-=${totalOffset * 100}vh` });

// Create a timeline that links to the scroll progress.
gsap
  .timeline({
    scrollTrigger: {
      trigger: container,
      start: "top top", // When the container hits the top of the viewport.
      // The end is set to the total scroll distance needed for all transitions.
      end: () => "+=" + totalOffset * window.innerHeight,
      scrub: true, // Syncs the animation with the scrollbar.
      pin: true, // Keeps the container in place during the scroll.
      snap: {
        // Custom snap function:
        // - Define an increment based on the number of transitions.
        // - If the progress is less than half an increment, return 0.
        // - Otherwise, round normally.
        snapTo: customSnap,
        duration: 0.15,
        delay: 0,
        ease: "power1.inOut",
      },
    },
  })
  // Animate the left column upward by the total offset.
  .to(leftColumn, { y: `-=${totalOffset * 100}vh`, ease: "none" }, 0)
  // Animate the right column downward from its pre-positioned offset back to 0.
  .to(rightColumn, { y: 0, ease: "none" }, 0);
