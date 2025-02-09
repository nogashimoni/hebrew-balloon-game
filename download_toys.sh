#!/bin/bash

# Create images/toys directory if it doesn't exist
mkdir -p images/toys

# Download toy images from placeholder service
# Note: In production, you should replace these with actual toy images
curl "https://placehold.co/400x400/FFB6C1/333333.png?text=Teddy+Bear" -o images/toys/teddy.png
curl "https://placehold.co/400x400/87CEEB/333333.png?text=Robot" -o images/toys/robot.png
curl "https://placehold.co/400x400/DDA0DD/333333.png?text=Unicorn" -o images/toys/unicorn.png
curl "https://placehold.co/400x400/90EE90/333333.png?text=Dinosaur" -o images/toys/dinosaur.png
curl "https://placehold.co/400x400/B0C4DE/333333.png?text=Spaceship" -o images/toys/spaceship.png
curl "https://placehold.co/400x400/FFB347/333333.png?text=Train" -o images/toys/train.png
