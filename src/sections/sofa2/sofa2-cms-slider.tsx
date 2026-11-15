import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useCmsSliderSlides } from './sofa2-cms-client';

export function Sofa2CmsSlider() {
  const { slides } = useCmsSliderSlides('Trang chủ');
  const [activeIndex, setActiveIndex] = useState(0);
  const active = slides[activeIndex];

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!active) return null;

  return (
    <Box component="section" sx={{ py: { xs: 5, md: 8 } }}>
      <Container>
        <Box
          sx={{
            position: 'relative',
            minHeight: { xs: 280, md: 420 },
            overflow: 'hidden',
            borderRadius: 3,
            backgroundImage: `linear-gradient(90deg, rgba(20,20,20,.76), rgba(20,20,20,.1)), url(${active.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Stack spacing={2} sx={{ position: 'relative', p: { xs: 3, md: 7 }, maxWidth: 640 }}>
            <Typography variant="h3" color="common.white">{active.title}</Typography>
            {active.link && (
              <Button component="a" href={active.link} variant="contained" sx={{ width: 'fit-content' }}>
                Khám phá
              </Button>
            )}
          </Stack>
          {slides.length > 1 && (
            <Stack direction="row" spacing={1} sx={{ position: 'absolute', bottom: 20, left: 28 }}>
              {slides.map((slide, index) => (
                <Box
                  key={`${slide.title}-${index}`}
                  component="button"
                  type="button"
                  aria-label={`Chuyển tới slide ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  sx={{
                    width: index === activeIndex ? 28 : 9,
                    height: 9,
                    border: 0,
                    borderRadius: 9,
                    p: 0,
                    cursor: 'pointer',
                    bgcolor: index === activeIndex ? 'common.white' : 'rgba(255,255,255,.55)',
                    transition: 'width .2s ease',
                  }}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Container>
    </Box>
  );
}
