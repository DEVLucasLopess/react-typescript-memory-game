import * as C from './styles';
import { GridItemType } from '../../types/gridItemType';
import b7Svg from '../../svgs/b7.svg';
import { items } from '../../data/items';

type Props = {
    item: GridItemType,
    onCLick: () => void
}

export const GridItem = ({item, onCLick}: Props) => {
    return (
        <C.Container 
        showBackground={item.permanentShown || item.shown}
        onClick={onCLick}>
            {item.permanentShown === false && item.shown === false &&
                <C.Icon src={b7Svg} alt=""  opacity={.1}/>
            }
            {(item.permanentShown || item.shown) && item.item !== null &&
                <C.Icon src={items[item.item].icon} alt="" />
            }
        </C.Container>
    )
}