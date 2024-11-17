import React from 'react';
import { Box, Typography, Card, CardContent, Avatar } from '@mui/material';

const testimonials = [
  {
    name: 'Sarah J.',
    text: "Booking through Holidaze was incredibly easy. I loved the transparent pricing and customer support was fantastic!",
    avatar: 'https://placekitten.com/100/100',
  },
  {
    name: 'John Doe',
    text: "I've been using Holidaze for over a year now and my experience has been amazing. The venues are always great and the prices are affordable!",
    avatar: 'https://placekitten.com/100/100',
  },
  {
    name: 'Anna S.',
    text: "I had a great experience with Holidaze. The booking process was smooth and the venue was perfect for my event.",
    avatar: 'https://placekitten.com/100/100',
  }
];

const Testimonials: React.FC = () => {
  return (
    <Box mt={8} px={3} py={5}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: '600', textAlign: 'center' }}>
        What our customers say
      </Typography>
      <Box display="flex" justifyContent="center" flexWrap="wrap">
        {testimonials.map((testimonial, index) => (
          <Card key={index} variant="outlined" sx={{ maxWidth: '300px', m: 2 }}>
            <CardContent>
              <Avatar src={testimonial.avatar} sx={{ width: 56, height: 56, mb: 2 }} />
              <Typography variant="body2" sx={{ mb: 2 }}>
                {testimonial.text}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {testimonial.name}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Testimonials;