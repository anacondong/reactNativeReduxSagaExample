import React from 'react';
import { Text } from 'react-native'
import { StyledScrollView } from './style'
import { Main } from '../Styled'


export const LinkComponent = () => {
    return (
        <Main>
            <StyledScrollView>
                <Text>This is Link Component</Text>
            </StyledScrollView>
        </Main>
    )
}