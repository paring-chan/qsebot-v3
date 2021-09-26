import React from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Popover, Select, TextField, Typography } from '@mui/material'
import type { AnswerButton } from '../../../src/models'
import { Picker } from 'emoji-mart'
import { useCustomEmojis } from '../utils/emojis'

enum ButtonStyle {
    PRIMARY = 'primary',
    SUCCESS = 'success',
    DANGER = 'error',
    SECONDARY = 'secondary',
}

const QuizAnswerButton: React.FC<{ button: AnswerButton; update: () => void; delete: () => void; disabled: boolean }> = ({ button, update, delete: remove, disabled }) => {
    let color: 'primary' | 'secondary' | 'success' | 'error' = ButtonStyle[button.style]
    const [open, setOpen] = React.useState(false)
    const emojiList = useCustomEmojis()

    const [emojiPopup, setEmojiPopup] = React.useState<HTMLButtonElement | null>(null)

    const emoji = emojiList.find((x) => x.id === button.emoji)

    return (
        <>
            <Button
                color={color}
                startIcon={emoji ? <img src={emoji.imageUrl} alt={emoji.name} width={16} height={16} /> : button.emoji}
                variant="contained"
                disableElevation
                onClick={() => setOpen(true)}
                disabled={disabled}
            >
                {button.label}
            </Button>
            <Dialog open={open} fullWidth maxWidth="md">
                <DialogTitle>버튼 수정</DialogTitle>
                <DialogContent>
                    <Popover keepMounted open={Boolean(emojiPopup)} anchorEl={emojiPopup} onClose={() => setEmojiPopup(null)}>
                        <Picker
                            onSelect={(emoji) => {
                                button.emoji = emojiList.find((x) => x.name === emoji.id)?.id || (emoji as any).native
                                setEmojiPopup(null)
                                update()
                            }}
                            custom={emojiList}
                        />
                    </Popover>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ mr: 2 }}>프리뷰</Typography>
                        <Button
                            startIcon={emoji ? <img src={emoji.imageUrl} alt={emoji.name} width={16} height={16} /> : button.emoji}
                            sx={{ mr: 2 }}
                            color={color}
                            variant="contained"
                            disableElevation
                        >
                            {button.label}
                        </Button>
                        <Button onClick={(e) => setEmojiPopup(e.currentTarget)} sx={{ mr: 2 }} color="success" variant="contained" disableElevation>
                            이모지 선택하기
                        </Button>
                    </Box>
                    <TextField
                        variant="standard"
                        label="텍스트"
                        value={button.label}
                        onChange={(e) => {
                            button.label = e.target.value
                            update()
                        }}
                        sx={{ mt: 2 }}
                        fullWidth
                    />
                    <FormControl fullWidth variant="standard" sx={{ mt: 2 }}>
                        <InputLabel>버튼 스타일</InputLabel>
                        <Select
                            value={button.style}
                            variant="standard"
                            label="버튼 스타일"
                            onChange={(e) => {
                                button.style = e.target.value as any
                                update()
                            }}
                        >
                            <MenuItem value="PRIMARY">PRIMARY</MenuItem>
                            <MenuItem value="SECONDARY">SECONDARY</MenuItem>
                            <MenuItem value="SUCCESS">SUCCESS</MenuItem>
                            <MenuItem value="DANGER">DANGER</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="error"
                        onClick={() => {
                            setOpen(false)
                            remove()
                        }}
                    >
                        삭제
                    </Button>
                    <Button onClick={() => setOpen(false)}>닫기</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default QuizAnswerButton
