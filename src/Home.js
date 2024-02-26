import React, {useState, useLayoutEffect}  from 'react';
import { Text } from 'react-native';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import loading from './loading.gif';

export default function Home() {
    const [recipeOfTheDay, setRecipeOfTheDay] = useState(undefined);
    let isFirst = true

    useLayoutEffect(() => {
        if(isFirst){
            isFirst = false;
            return
        }

        axios({
            method: 'get',
            url: 'https://www.themealdb.com/api/json/v1/1/random.php'
          })
        .then((response) =>
        {
            console.log(response.data);
            
            setRecipeOfTheDay(response.data.meals[0]);
        });
    }, []);

    if (recipeOfTheDay) {
        return <div className='recipe'>
            <img src={ recipeOfTheDay.strMealThumb }/>
            <div className='recipe-text'> 
                <h2>Recipe of the day: { recipeOfTheDay.strMeal }</h2>
                <Text style={{ textAlign: "left" }}>
                    { recipeOfTheDay.strInstructions}
                </Text>
            </div>
        </div>;
    } else {

    return <Container>
       <img src={ loading }/>
    </Container>;
    }
}