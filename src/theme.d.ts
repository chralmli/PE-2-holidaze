import '@mui/system';

declare module '@mui/system' {
    interface BreakpointOverrides {
        // Custom breakpoints
        laptop: true;
        tablet: true;
        mobile: true;
        desktop: true;
        // Remove default breakpoints
        xs: false;
        sm: false;
        md: false;
        lg: false;
        xl: false;
    }
}