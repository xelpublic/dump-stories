import { useContext } from 'react'
import { observer } from 'mobx-react-lite';
import { RootContext } from '../../context/RootContext';



export const ResultStory: React.FC = observer(() => {
    const { game } = useContext(RootContext)
    const { user } = useContext(RootContext);

    const clickNewGame = async () => {
        game.currentGame = undefined;

    }

    if (!game.currentGame!.resultStory) {
        game.currentGame!.makeResultStory();
        if (user.isAuth) {
            game.currentGame!.persist();
        }
    }

    return (
        <div className="container">
            <div style={{ width: '35rem' }}>
                <h4>Итак история...</h4>
                <h6>
                    <span dangerouslySetInnerHTML={{ __html: game.currentGame!.resultStory }} />
                </h6>
                <button type="button" className="btn right marg-t3"
                    onClick={clickNewGame}>Начать новую игру</button>
            </div>
        </div>
    )
})
