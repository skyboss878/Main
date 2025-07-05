import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const VideoContext = createContext()

export const useVideo = () => {
  const context = useContext(VideoContext)
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider')
  }
  return context
}

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([])
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  const generateSocialVideo = async (prompt, options = {}) => {
    setGenerating(true)
    setProgress(0)
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 500)

      const response = await axios.post('/api/videos/social', {
        prompt,
        options
      })

      clearInterval(progressInterval)
      setProgress(100)

      const newVideo = response.data.video
      setVideos(prev => [newVideo, ...prev])
      
      toast.success('Social media
