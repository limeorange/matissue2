"use client";
import Link from "next/link";
import styled from "styled-components";
import Button from "../../components/UI/Button";
import { useState, useEffect } from "react";
import React from "react";
import RecipeCard from "../recipe-card/RecipeCard";
import { axiosBase } from "@/app/api/axios";
import NonRecipe from "../UI/NonRecipe";
import { Recipe } from "@/app/types";

// type Recipe = {
//   recipe_title: string;
//   recipe_thumbnail: string;
//   recipe_id: string;
//   recipe_view: number;
//   user_id: string;
//   user_nickname: string;
//   created_at: string;
//   recipe_like: number;
// };

const RecipeCards = ({ user }: { user: string | undefined }) => {
  const [recipes, setFilteredRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axiosBase.get(`/recipes/${user}`);
        console.log("response  : ", response);
        setFilteredRecipes(response.data);
      } catch (error) {
        console.error(
          "레시피 데이터를 가져오는 중에 오류가 발생했습니다:",
          error
        );
      }
    };

    fetchRecipes();
  }, []);

  const handleDeleteRecipe = async (id: string) => {
    const updatedRecipes = recipes.filter((recipe) => recipe.recipe_id !== id);
    setFilteredRecipes(updatedRecipes);

    try {
      // 서버로 DELETE 요청 보내기
      await axiosBase.delete(`recipes/${id}`);
      console.log("레시피 삭제 요청이 성공적으로 전송되었습니다.");
    } catch (error) {
      console.error(
        "레시피 삭제 요청을 보내는 중에 오류가 발생했습니다:",
        error
      );
    }
  };

  return (
    <RecipeListContainer>
      <RecipeHeading>나의 레시피</RecipeHeading>
      <RecipeHeadingCount>{recipes.length}</RecipeHeadingCount>
      {recipes.length === 0 && <NonRecipeMsg />}
      <RecipeList>
        {recipes.map((recipe) => (
          <RecipeCardWrapper key={recipe.recipe_id}>
            <StyledRecipeCard recipe={recipe} />
            <button onClick={() => handleDeleteRecipe(recipe.recipe_id)}>
              <DeleteButtonImage src="/images/x-box.png" alt="X-box" />
            </button>
          </RecipeCardWrapper>
        ))}
      </RecipeList>
    </RecipeListContainer>
  );
};

export default RecipeCards;

// 레시피 리스트

const RecipeListContainer = styled.div`
  width: 100%;
`;

const RecipeHeading = styled.span`
  font-size: 18px;
  letter-spacing: 0.01em;
  margin: 0 0.5rem 0 1.9rem;
  font-weight: 600;
  color: #4f3d21;
`;

const RecipeHeadingCount = styled.span`
  font-size: 17px;
  font-weight: 700;
  color: #545454;
`;

const RecipeList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 1.5rem;
`;

const RecipeCardWrapper = styled.div`
  position: relative;
`;

const StyledRecipeCard = styled(RecipeCard)`
  font-size: 13px !important;
`;

const DeleteButtonImage = styled.img`
  position: absolute;
  top: 21rem;
  right: 1.5rem;
  width: 1.8rem;
  height: 1.8rem;
  transition: transform 0.1s ease-in-out;
  &:hover {
    transform: scale(1.2);
  }
`;

const NonRecipeMsg = styled(NonRecipe)``;
