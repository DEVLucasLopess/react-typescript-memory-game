import * as C from './styles'

type Props = {
    label: string;
    icon?: any;
    onCLick: React.MouseEventHandler<HTMLDivElement>;
}

export const Button = ({label, icon, onCLick} : Props) => {
    return (
        <C.Container onClick={onCLick}>
            {icon && 
                <C.IconArea>
                    <C.Icon src={icon} />
                </C.IconArea>
            }
            <C.Label> {label} </C.Label>
        </C.Container>
    );
}