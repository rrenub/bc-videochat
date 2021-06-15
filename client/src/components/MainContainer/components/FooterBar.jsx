import React from 'react';
import { Layout, Typography } from 'antd'
import { GithubOutlined } from '@ant-design/icons';

const { Footer } = Layout
const { Text } = Typography

const FooterBar = () => {
    return (
        <Footer className="footer_wrapper">
                <Text type="secondary">
                    Trabajo de fin de grado de Rubén Delgado Gonzálex | GITT ULPGC
                </Text>
                <Text type="secondary">
                    <a 
                        target="_blank" 
                        className="github_link"
                        href="https://github.com/rrenub">
                            Github <GithubOutlined />
                    </a>
                </Text>
        </Footer>
    );
};

export default FooterBar;