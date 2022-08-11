import { useEffect, useState} from 'react'
import * as C from './App.styles';

import { GridItemType } from './types/gridItemType';
import logoImage from './assets/devmemory_logo.png';
import IconRestart from './svgs/restart.svg';
import { items } from './data/items';

import { InfoItem } from './components/InfoItem';
import { Button } from './components/Button';
import { GridItem } from './components/GridItem';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';

const App = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount ] = useState<number>(0);
  const [shownCount, setShownCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if(playing) {
        setTimeElapsed(timeElapsed + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, timeElapsed]);

  useEffect(() => { 
    resetAndCreateGrid(); 
  }, [])

  // verificar se os abertos são iguais.
  useEffect(() => {
    if (shownCount === 2) {
      let opened = gridItems.filter(item => item.shown === true);
      if (opened.length === 2) {

        // verificação 1 - se eles são igauis ... torna-los permanentes.
        if (opened[0].item === opened[1].item) {
          let tempGrid = [...gridItems];
          for(let i in tempGrid) {
            if(tempGrid[i].shown) {
              tempGrid[i].permanentShown = true;
              tempGrid[i].shown = false;
            }
          }
          setGridItems(tempGrid);
          setShownCount(0);
        } else {
          // v2 - se não for igual, feche todos.
          setTimeout(()=>{
            let tempGrid = [...gridItems];
            for (let i in tempGrid) {
              tempGrid[i].shown = false;
            }
            setGridItems(tempGrid);
            setShownCount(0);
          }, 1000);
        }
        setMoveCount(moveCount => moveCount + 1);
      }
    }
  }, [shownCount, gridItems]);

    // verificando se o jogo acabou
    useEffect(() => {
      if (moveCount > 0 && gridItems.every(item => item.permanentShown === true )) {
        setPlaying(false);
      }
    }, [shownCount, gridItems]);
  
  const resetAndCreateGrid = async () => {
    // step 1 - resetar o jogo
    setTimeElapsed(0);
    setMoveCount(0);
    setShownCount(0);

    // step 2 - criar o grid
    setGridItems([]); // 2.1 criar um grid vazio
    let tempGrid: GridItemType[] = [];
    for (let i = 0; i < (items.length * 2); i++) {
      tempGrid.push({
        item: null,
        shown: false,
        permanentShown: false
      });
    }

    // 2.2 preencher o grid
    for(let w = 0; w < 2; w++) {
      for(let x = 0; x < items.length; x++ ) {
        let pos = -1;
        while(pos < 0 || tempGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2));
        }
        tempGrid[pos].item = x;
      }
    }
    
    //2.3 - jogar no state
    setGridItems(tempGrid);

    // step 3 - iniciar o jogo
    setPlaying(true);

  }

  const handleItemClick = (index: number) => {
      if (playing && index !== null && shownCount < 2) {
        let tmpGrid = [ ...gridItems];

        if (tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
          tmpGrid[index].shown = true;
          setShownCount(shownCount + 1);
        }

        setGridItems(tmpGrid);
      }
  }

  return(
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={logoImage} width="200" alt="" />
        </C.LogoLink>

        <C.InfoArea>
          <InfoItem label="Tempo:" value={formatTimeElapsed(timeElapsed)}/>
          <InfoItem label="Movimentos:" value={moveCount.toString()} />
        </C.InfoArea>

        <Button icon={IconRestart} label="Reiniciar" onCLick={resetAndCreateGrid} />
      </C.Info>
      
      <C.GridArea>
        <C.Grid>
         {gridItems.map((item, index) => (
          <GridItem 
            key={index}
            item={item}
            onCLick={() => handleItemClick(index)}
          />
         ))} 
        </C.Grid>
      </C.GridArea>
    </C.Container>
  )
}

export default App;