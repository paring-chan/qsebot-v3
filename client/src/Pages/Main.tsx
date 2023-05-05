import React from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import { ExpandMore } from '@mui/icons-material'

const Main: React.FC = () => {
  return (
    <div>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>퀴즈</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6">큐세와 관련된 퀴즈를 풀 수 있습니다</Typography>
          <Typography>명령어: !퀴즈</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>가위바위보</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6">큐새랑 가위바위보를 할 수 있습니다</Typography>
          <Typography>명령어: !가위바위보</Typography>
          <Typography variant="h6">가위바위보 승률 보기</Typography>
          <Typography>명령어: !승률</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>주사위</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6">주사위를 굴려서 나올 랜덤 숫자를 예측할 수 있습니다</Typography>
          <Typography>명령어: !주사위</Typography>
          <Typography variant="h6">승률 보기</Typography>
          <Typography>명령어: !주사위 승률</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>밥</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6">오늘 먹을 걸 추천해줍니다</Typography>
          <Typography>명령어: !밥</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>치킨</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6">치킨 브랜드를 추천해줍니다</Typography>
          <Typography>명령어: !치킨</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default Main
