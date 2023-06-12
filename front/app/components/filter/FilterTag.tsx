"use client";

import { useEffect, useState } from "react";
import { Filter } from "../listings/ListingRecipe";
import styled from "styled-components";

type FilterTagProps = {
  search: string | null | undefined;
  filter: Filter;
  category: string | null | undefined;
  onRemove: (tagType: string) => void;
};

type TagListType = {
  tag: string;
  type: string;
};

const FilterTag = (props: FilterTagProps) => {
  const [tagList, setTagList] = useState<TagListType[]>([]);
  const { search, filter, category, onRemove } = props;

  // 검색바 입력값 및 필터바 필터 값에 따른 태그 추가
  useEffect(() => {
    const newTagList: TagListType[] = [];

    if (search) {
      newTagList.push({ tag: `#${search}`, type: "search" });
    }

    if (category === "western") {
      newTagList.push({ tag: `#양식`, type: "category" });
    }
    if (category === "chinese") {
      newTagList.push({ tag: `#중식`, type: "category" });
    }
    if (category === "japanese") {
      newTagList.push({ tag: `#일식`, type: "category" });
    }
    if (category === "korean") {
      newTagList.push({ tag: `#한식`, type: "category" });
    }
    if (category === "best") {
      newTagList.push({ tag: `#베스트 레시피`, type: "category" });
    }
    if (category === "newest") {
      newTagList.push({ tag: `#최신 레시피`, type: "category" });
    }
    if (category === "honmuk") {
      newTagList.push({ tag: `#혼먹 레시피`, type: "category" });
    }
    if (category === "vegetarian") {
      newTagList.push({ tag: `#채식 레시피`, type: "category" });
    }
    if (filter.servings > 0) {
      newTagList.push({ tag: `#${filter.servings}인`, type: "servings" });
    }
    if (filter.duration > 0) {
      newTagList.push({ tag: `#${filter.duration}분`, type: "duration" });
    }
    if (filter.difficulty > -1) {
      if (filter.difficulty === 0) {
        newTagList.push({ tag: `#쉬움`, type: "difficulty" });
      } else if (filter.difficulty === 1) {
        newTagList.push({ tag: `#중간`, type: "difficulty" });
      } else {
        newTagList.push({ tag: `#어려움`, type: "difficulty" });
      }
    }

    setTagList(newTagList);
  }, [search, filter, category]);

  return (
    <>
      <FilterTagBox>
        <p>검색결과</p>
        {tagList.map((item, index) => (
          <span key={index}>
            {item.tag}
            <RemoveButton onClick={() => onRemove(item.type)}>X</RemoveButton>
          </span>
        ))}
      </FilterTagBox>
    </>
  );
};

export default FilterTag;

const FilterTagBox = styled.div`
  font-size: 16px;
  color: #9f783a;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
  gap: 1.6rem;
  flex-wrap: wrap;

  & p {
    color: #4f3d21;
    width: 100%;
    text-align: center;
  }

  & span {
    background-color: #fbd26a;
    border-radius: 10rem;
    padding: 0.5rem 1.5rem;

    @media (max-width: 425px) {
      border-radius: 0.5rem;
      padding: 0 0.9rem 0 0.9rem;
  }

  @media (max-width: 425px) {
    font-size: 14px;
    gap: 0.5rem;
  }
`;

const RemoveButton = styled.button`
  margin-left: 0.5rem;
  color: #b89b6f;
  border-radius: 0.5rem;
  font-size: 13px;

  &:hover {
    color: #9f783a;
  }

  @media (max-width: 425px) {
    font-size: 15px;
  }
`;
