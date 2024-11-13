import { Container, Group, ActionIcon, rem } from '@mantine/core';
import { IconBrandX, IconBrandYoutube, IconBrandInstagram, IconBrandFacebook } from '@tabler/icons-react';
import eventerLogo from '../Logo/eventerLogo.png';
import classes from './Footer.module.css';

export function FooterSocial() {
    const handleTwitterClick = () => {
        window.open('https://twitter.com/MrBeast', '_blank');
    };

    const handleFacebookClick = () => {
        window.open('https://www.facebook.com/MrBeast', '_blank');
    };

    const handleInstagramClick = () => {
        window.open('https://www.instagram.com/MrBeast', '_blank');
    };

    return (
        <div className={classes.footer} style={{ marginBottom: '25px !important' }}>
            <Container className={classes.inner} style={{ paddingBottom: '0' }}>
                <img src={eventerLogo} alt="Eventer Logo" style={{ width: 300, height: 50 }} />
                <Group gap={0} className={classes.links} justify="flex-end" wrap="nowrap">
                    <ActionIcon size="lg" color="white" variant="subtle" onClick={handleTwitterClick}>
                        <IconBrandX style={{ width: rem(25), height: rem(25) }} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon size="lg" color="white" variant="subtle" onClick={handleFacebookClick}>
                        <IconBrandFacebook style={{ width: rem(25), height: rem(25) }} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon size="lg" color="white" variant="subtle" onClick={handleInstagramClick}>
                        <IconBrandInstagram style={{ width: rem(25), height: rem(25) }} stroke={1.5} />
                    </ActionIcon>
                </Group>
            </Container>
            <div className={classes.footerBottom} style={{ textAlign: 'center', marginBottom: '15px !important' }}>
                <div className={classes.info}>
                    <p style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#FF69B4', marginTop: "0" }}>
                        <a href="mailto:support@mrbeast.com" style={{ color: '#FF69B4', textDecoration: 'none' }}>
                            support@mrbeast.com
                        </a>
                    </p>
                    <p style={{ color: 'white', fontWeight: 500 }}>
                        1234 Example St, Greenville, NC 27834
                    </p>
                </div>
                <p style={{ color: 'white', fontWeight: 500 }}>
                    &copy; 2024 MrBeast Inc. | All Rights Reserved
                </p>
                <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    <a href="https://mrbeast.store/policies/privacy-policy" style={{ color: '#FF69B4', textDecoration: 'none' }}>
                        Privacy Policy
                    </a>
                </p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#FF69B4' }}>
                    Powered by Eventer
                </p>
            </div>
        </div>
    );
}
