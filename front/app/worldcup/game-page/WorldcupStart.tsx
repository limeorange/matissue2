"use client";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { getAllRecipes } from "@/app/api/recipe";
import Link from "next/link";
import LoadingModal from "@/app/components/UI/LoadingModal";
import Logo from "@/app/components/header/Logo";

type StyledComponentProps = {
  isAnimateOut?: boolean;
};

type Recipe = {
  recipe_id: string;
  recipe_title: string;
  recipe_thumbnail: string;
};

const WorldcupGame: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const num = searchParams.get("stage");

  const [foods, setFoods] = useState<Recipe[]>([]);
  const [displays, setDisplays] = useState<Recipe[]>([]);
  const [winners, setWinners] = useState<Recipe[]>([]);
  const [stage, setStage] = useState(num ? parseInt(num) : 16);
  const [selectedCount, setSelectedCount] = useState(0);
  const [isAnimateOut, setIsAnimateOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipes = await getAllRecipes();
        recipes.sort(() => Math.random() - 0.5);
        const selectedRecipes = recipes.slice(0, num);
        setFoods(selectedRecipes);
        setDisplays([selectedRecipes[0], selectedRecipes[1]]);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [num]);

  const clickHandler = (food: Recipe) => () => {
    if (stage !== 1) {
      setSelectedCount((prevCount) => prevCount + 1);
    }

    if (foods.length <= 2) {
      if (winners.length === 0) {
        const queryParams = { winnerId: food.recipe_id };
        const query = new URLSearchParams(queryParams).toString();
        router.push(`/worldcup/game-page/result?${query}`);
      } else {
        const updatedFood = [...winners, food];
        setFoods(updatedFood);
        setDisplays([updatedFood[0], updatedFood[1]]);
        setWinners([]);
        setStage((prevStage) => prevStage / 2);
        setSelectedCount(0);
      }
    } else if (foods.length > 2) {
      setWinners([...winners, food]);
      setDisplays([foods[2], foods[3]]);
      setFoods(foods.slice(2));
    }
  };

  if (isLoading) {
    return <LoadingModal />;
  }

  return (
    <WorldcupLayout>
      <Logo />
      <GameHeader>레시피 이상형 월드컵!</GameHeader>
      <GameProgress>
        {stage === 2
          ? "결승전"
          : `${stage}강 (${selectedCount + 1}/${stage / 2})`}
      </GameProgress>
      <CardContainer>
        {displays.map((recipe, index) =>
          stage === 1 && displays.length === 1 ? (
            <>
              {index !== 0 && <VS>VS</VS>}
              <Link
                href={`/recipes/${recipe.recipe_id}`}
                key={recipe.recipe_id}
                passHref
              >
                <Card onClick={clickHandler(recipe)}>
                  <RecipeTitleBox>{recipe.recipe_title}</RecipeTitleBox>
                  <ImageWrapper>
                    <ImageContainer>
                      <Image
                        src={recipe.recipe_thumbnail}
                        alt={recipe.recipe_title}
                        layout="fill"
                        objectFit="cover"
                        style={{ borderRadius: "1.5rem" }}
                      />
                    </ImageContainer>
                  </ImageWrapper>
                </Card>
              </Link>
            </>
          ) : (
            <>
              {index !== 0 && <VS>VS</VS>}
              <Card onClick={clickHandler(recipe)} key={recipe.recipe_id}>
                <RecipeTitleBox>{recipe.recipe_title}</RecipeTitleBox>
                <ImageWrapper>
                  <ImageContainer>
                    <Image
                      src={recipe.recipe_thumbnail}
                      alt={recipe.recipe_title}
                      layout="fill"
                      objectFit="cover"
                      style={{ borderRadius: "1.5rem" }}
                    />
                  </ImageContainer>
                </ImageWrapper>
              </Card>
            </>
          )
        )}
      </CardContainer>
    </WorldcupLayout>
  );
};

export default WorldcupGame;

const WorldcupLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  width: 100%;
  max-width: 50rem;
  height: 100vh;

  @keyframes slideUp {
    0% {
      transform: translateY(10%);
      opacity: 0;
    }

    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const GameHeader = styled.p<StyledComponentProps>`
  font-size: 80px;
  color: #fbd26a;
  font-family: "Dongle-Bold";
  margin-bottom: -3rem;

  & span {
    font-size: 40px;
  }
`;

const GameProgress = styled.div`
  font-size: 50px;
  color: #4f3d21;
  margin-bottom: 2rem;
  font-family: "Dongle-Bold";
  transform-origin: center;
  transition: all 0.5s ease;
  opacity: 1;

  &.grow {
    transform: scale(0.1);
    opacity: 0;
  }
  &.normal {
    transform: scale(1);
    opacity: 1;
  }
  &.shrink {
    transform: scale(0.1);
    opacity: 0;
  }
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const VS = styled.div`
  font-size: 50px;
  color: #4f3d21;
  font-family: "Dongle-Bold";
  margin-left: 2rem;
  margin-right: 2rem;
  margin-top: 3rem;
  transform-origin: center;
  transition: all 0.5s ease;
  opacity: 1;

  &.grow {
    transform: scale(0.1);
    opacity: 0;
  }
  &.normal {
    transform: scale(1);
    opacity: 1;
  }
  &.shrink {
    transform: scale(0.1);
    opacity: 0;
  }
`;

const Card = styled.div`
  width: 32.5rem;
  border: none;
  box-sizing: border-box;
  cursor: pointer;
  position: relative;
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

const RecipeTitleBox = styled.div`
  font-size: 20px;
  color: #4f3d21;
  margin-bottom: 1rem;
  white-space: pre-line;
  text-align: center;
  transform-origin: center;
  transition: all 0.3s ease;
  opacity: 1;

  ${Card}:hover & {
    transform: translateY(-5px);
  }
`;

const ImageWrapper = styled.div`
  width: 32.5rem;
  height: 32.5rem;
  overflow: hidden;
  box-shadow: 0 0 0.3rem rgba(0, 0, 0, 0.3);
  border-radius: 1.5rem;
  position: relative;
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transition: opacity 0.3s ease;
  opacity: 1;

  ${ImageWrapper}:hover & {
    opacity: 0.8;
  }
`;
