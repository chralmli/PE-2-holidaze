import React from 'react';
import { Box, Typography, Card, CardContent, Avatar, Grid, Container } from '@mui/material';
import { FormatQuote as QuoteIcon } from '@mui/icons-material';

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
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: '2',
    name: 'Peter L. Moretti',
    text: "I've been using Holidaze for over a year now and my experience has been amazing. The venues are always great and the prices are affordable!",
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Peter',
  },
  {
    id: '3',
    name: 'Anna S.',
    text: "I had a great experience with Holidaze. The booking process was smooth and the venue was perfect for my event.",
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
  }
];

const Testimonials: React.FC = () => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: (theme) => `linear-gradient(to bottom, ${theme.palette.grey[50]}, white)`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #34e89e 0%, #0f3443 100%)',
          opacity: 0.03,
          zIndex: 0,
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontWeight: 600,
              background: 'linear-gradient(135deg, #34e89e 0%, #0f3443 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            What our customers say
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto' }}
          >
            Don't just take our word for it - hear from some of our satisfied customers
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {testimonials.map((testimonial) => (
            <Grid item xs={12} md={4} key={testimonial.id}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  p: 2,
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: 'grey.100',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: (theme) => `0 12px 24px ${theme.palette.grey[200]}`,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ position: 'relative', mb: 3 }}>
                    <Avatar
                      src={testimonial.avatar}
                      alt={`${testimonial.name}'s avatar`}
                      sx={{
                        width: 80,
                        height: 80,
                        border: '3px solid',
                        borderColor: 'secondary.main',
                        boxShadow: '0 4px 14px rgba(52, 232, 158, 0.2)',                      
                      }}
                    />
                    <QuoteIcon
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        color: 'grey.200',
                        fontSize: '3rem',
                      }}
                    />
                  </Box>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      fontStyle: 'italic',
                      lineHeight: 1.6,
                    }}
                  >
                    "{testimonial.text}"
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: 'primary.main',
                    }}
                  >
                    {testimonial.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Testimonials;