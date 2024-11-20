import React from 'react';
import { Box, Typography, Card, CardContent, Avatar, Grid } from '@mui/material';
import { styled } from '@mui/system';

interface Testimonial {
  id: string;
  name: string;
  text: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah J.',
    text: "Booking through Holidaze was incredibly easy. I loved the transparent pricing and customer support was fantastic!",
    avatar: 'https://placekitten.com/100/100',
  },
  {
    id: '2',
    name: 'John Doe',
    text: "I've been using Holidaze for over a year now and my experience has been amazing. The venues are always great and the prices are affordable!",
    avatar: 'https://placekitten.com/100/100',
  },
  {
    id: '3',
    name: 'Anna S.',
    text: "I had a great experience with Holidaze. The booking process was smooth and the venue was perfect for my event.",
    avatar: 'https://placekitten.com/100/100',
  }
];

const StyledCard = styled(Card)({
  maxWidth: '350px',
  margin: '16px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: '16px',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
});

const StyledAvatar = styled(Avatar)({
  width: 72,
  height: 72,
  marginBottom: '16px',
  border: '4px solid #34e89e',
});

const Testimonials: React.FC = () => {
  return (
    <Box mt={8} px={3} py={5}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: '500', textAlign: 'center', fontFamily: 'Poppins' }}>
        What our customers say
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {testimonials.map((testimonial) => (
          <Grid item key={testimonial.id}>
            <StyledCard variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <StyledAvatar src={testimonial.avatar} alt={`${testimonial.name}'s avatar`} />
                <Typography color="text.secondary" variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                  {testimonial.text}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0f3443' }}>
                  {testimonial.name}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Testimonials;