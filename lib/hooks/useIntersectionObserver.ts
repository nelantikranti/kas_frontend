"use client";

import { useEffect } from "react";

export function useIntersectionObserver() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Once the animation is triggered, we can stop observing this element
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    // Initial observation
    const elements = document.querySelectorAll(".reveal, .reveal-stagger");
    elements.forEach((el) => observer.observe(el));

    // Handle dynamic content (optional but good for SPA)
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.classList.contains("reveal") || node.classList.contains("reveal-stagger")) {
              observer.observe(node);
            }
            node.querySelectorAll(".reveal, .reveal-stagger").forEach((el) => {
              observer.observe(el);
            });
          }
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
