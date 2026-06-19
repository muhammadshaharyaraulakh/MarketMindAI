<?php
$str = '{
  "primary_texts": [
    {
      "type": "emotional",
      "text": "Your skin deserves a moment of pure, natural care. Discover the Saeed Ghani Skincare Set—a collection designed to reveal your inner glow and keep your skin feeling hydrated and refreshed all day long. Embrace the beauty of nature and transform your daily routine into a luxurious self-care ritual. Because when your skin feels good, you feel unstoppable. Shop the collection now and treat yourself to the radiance you deserve."
    },
    {
      "type": "offer_focused",
      "text": "Elevate your skincare game with the complete Saeed Ghani Skincare Set. Curated for those who demand quality and natural ingredients, this set provides everything you need for a healthy, vibrant complexion. Experience the professional difference of premium skincare delivered straight to your door. Don\'t wait for the glow—start your journey to healthier skin today. Click below to explore the full set on our website."
    },
    {
      "type": "problem_solution",
      "text": "Tired of dull, tired-looking skin? Say goodbye to complex routines and hello to simplicity. The Saeed Ghani Skincare Set combines essential, nature-inspired formulas to hydrate, brighten, and revitalize your face. Whether you are dealing with dryness or just want a more luminous complexion, our set is your perfect daily partner. Achieve that professional spa-like glow at home. Tap to shop the set and refresh your skin routine today!"
    }
  ],
  "headlines": [
    "Reveal Your Natural Glow",
    "Complete Skincare, Naturally",
    "The Ultimate Daily Radiance Routine",
    "Hydrate, Brighten, Refresh",
    "Saeed Ghani: Your Skin\'s Best Friend"
  ],
  "link_descriptions": [
    "Shop the full collection online",
    "Join thousands of happy customers",
    "Natural skincare for every skin type"
  ],
  "carousel_cards": [
    {"headline": "Deep Hydration", "description": "Locks in moisture for all-day softness."},
    {"headline": "Natural Glow", "description": "Enhance your natural radiance instantly."},
    {"headline": "Refreshing Feel", "description": "Revitalize tired skin with every use."},
    {"headline": "Premium Ingredients", "description": "Quality care sourced from nature."},
    {"headline": "Complete Routine", "description": "Everything you need in one set."}
  ],
  "video_scripts": {
    "fifteen_second": [
      { "timestamp": "0:00-0:03", "visual_cue": "Close up of the product set on a marble vanity.", "voiceover": "Ready to unlock your most radiant skin yet?", "other_details": "Text: The Secret to Glowing Skin" },
      { "timestamp": "0:03-0:10", "visual_cue": "Quick cuts of someone applying serum and cream.", "voiceover": "The Saeed Ghani Skincare Set uses natural ingredients to hydrate and refresh your face.", "other_details": "Text: Natural & Hydrating" },
      { "timestamp": "0:10-0:15", "visual_cue": "Model smiling, looking at camera.", "voiceover": "Shop the collection now and glow on.", "other_details": "Text: Shop Now" }
    ],
    "thirty_second": [
      { "timestamp": "0:00-0:05", "visual_cue": "Top-down view of the set being unboxed.", "voiceover": "Stop settling for dull skin. It\'s time for a professional-grade glow.", "other_details": "Text: Your Glow-Up Starts Here" },
      { "timestamp": "0:05-0:15", "visual_cue": "Macro shots of product textures and ingredients.", "voiceover": "The Saeed Ghani Skincare Set is packed with natural goodness to deeply hydrate and brighten your complexion.", "other_details": "Text: Deep Hydration" },
      { "timestamp": "0:15-0:25", "visual_cue": "Split screen: before/after application.", "voiceover": "From morning prep to nightly repair, our set ensures your skin stays refreshed and healthy.", "other_details": "Text: Refresh & Revitalize" },
      { "timestamp": "0:25-0:30", "visual_cue": "Website landing page on mobile screen.", "voiceover": "Visit our website and start your journey to better skin today.", "other_details": "Text: Shop Now" }
    ]
  },
  "image_prompts": [
    "Professional studio photography of a skincare set on a white marble surface, sunlight casting soft shadows, minimalist aesthetic, high resolution, 8k.",
    "A aesthetic flatlay of skincare bottles with fresh aloe vera and flower petals scattered around, soft natural lighting, pastel color palette, feminine mood.",
    "Close-up of a woman with glowing, healthy skin, holding a skincare jar, soft-focus background, warm lighting, natural makeup look, high detail.",
    "A clean, organized bathroom vanity with the skincare set arranged neatly, soft morning light coming through a window, serene and refreshing atmosphere.",
    "Macro shot of a serum drop on skin, water droplets in background, vibrant and fresh, professional skincare advertisement style, high-end look."
  ]
}';
json_decode($str);
echo "Error: " . json_last_error_msg() . "\n";
