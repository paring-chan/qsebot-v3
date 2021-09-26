import React from 'react'
import { useRouteMatch } from 'react-router-dom'
import { useRequest } from '../../../utils/request'
import { Box, Button, TextField, Typography } from '@mui/material'
import { Add, Delete } from '@mui/icons-material'
import { useForceUpdate } from '../../../utils/update'
import type { AnswerButton } from '../../../../../src/models'

const QuizEdit: React.FC = () => {
    const {
        params: { id },
    } = useRouteMatch<{ id: string }>()

    const { data } = useRequest(`/admin/quiz/${id}`)

    const [question, setQuestion] = React.useState(data.question)

    const [answers] = React.useState<AnswerButton[][]>(data.answers)

    const forceUpdate = useForceUpdate()

    return (
        <div>
            <Box sx={{ mt: 4, display: 'flex' }}>
                <Typography variant="h4" fontWeight={700}>
                    퀴즈 관리
                </Typography>
                <div style={{ flexGrow: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button color="error" variant="outlined" startIcon={<Delete />}>
                        삭제하기
                    </Button>
                </Box>
            </Box>
            <Box sx={{ mt: 4 }}>
                <TextField label="질문" variant="standard" fullWidth value={question} onChange={(e) => setQuestion(e.target.value)} multiline />
            </Box>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexDirection: 'column' }}>
                {answers.map((x, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                        {x.map((y, j) => (
                            <Button variant="outlined" key={j}>
                                {y.label}
                            </Button>
                        ))}
                        <Button
                            startIcon={<Add />}
                            variant="outlined"
                            onClick={() => {
                                x.push({ label: 'Text', answer: 'Text', emoji: '' })
                                forceUpdate()
                            }}
                        >
                            행 추가하기
                        </Button>
                    </Box>
                ))}
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => {
                        answers.push([])
                        forceUpdate()
                    }}
                >
                    열 추가하기
                </Button>
            </Box>
        </div>
    )
}

export default QuizEdit
