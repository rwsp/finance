import * as React from 'react';
import { css } from 'emotion';

const styles = {
    testStyle: css`
        color: blue;     
    `
};

const TestComponent: React.FC = () => (
    <div className={styles.testStyle}>
        this is a test
    </div>);

export default TestComponent;