import React, {useState, useLayoutEffect}  from 'react';
import { Text } from 'react-native';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import loading from './loading.gif';

export default function Home() {
    const [recipeOfTheDay, setRecipeOfTheDay] = useState(undefined);
    const [isFirst, setisFirst] = useState(true);

    useLayoutEffect(() => {
        if(isFirst){
            setisFirst(false);
            return
        }
        getRandomRecipe(setRecipeOfTheDay)
        
    }, [isFirst]);

    if (recipeOfTheDay) {
        return <div className='recipe'>
            <img alt={"picture of" + recipeOfTheDay.strMeal} src={ recipeOfTheDay.strMealThumb }/>
            <div className='recipe-text'> 
                <h2>Recipe of the day: { recipeOfTheDay.strMeal }</h2>
                <ul className='ingredients-list'>
                    {
                        recipeOfTheDay.ingredients.map((ingredient, i) => {      
                            return (<li key={i}>{ingredient}</li>)
                        })
                    }
                </ul>
                <Text>{ recipeOfTheDay.strInstructions}</Text>
            </div>
        </div>;
    } else {

    return <Container>
       <img alt="loading" src={ loading }/>
    </Container>;
    }
}

function getRandomRecipe(setFunction) {
    axios({
        method: 'get',
        url: 'https://www.themealdb.com/api/json/v1/1/random.php'
      })
    .then((response) =>
    {
        let ingredients = [];
        
        for (let i = 1; i <= 20; i++) {
            if (response.data.meals[0]["strIngredient" + i]) {
                ingredients.push(response.data.meals[0]["strMeasure" + i] + " " +response.data.meals[0]["strIngredient" + i] )
            }
        }
        
        // console.log(ingredients);
        response.data.meals[0].ingredients = ingredients;
        
        setFunction(response.data.meals[0]);
    });
}