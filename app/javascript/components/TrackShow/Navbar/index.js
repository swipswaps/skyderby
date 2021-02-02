import React, { useLayoutEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import ChartIcon from 'icons/chart-bar.svg'
import VideoIcon from 'icons/play-circle.svg'
import MapsIcon from 'icons/compass.svg'
import ListIcon from 'icons/list-ul.svg'
import WindIcon from 'icons/wind-direction.svg'
import { useI18n } from 'components/TranslationsProvider'
import { selectWindData } from 'redux/tracks/windData'

import styles from './styles.module.scss'

const Navbar = ({ track }) => {
  const { t } = useI18n()
  const {
    id: trackId,
    hasVideo,
    permissions: { canEdit }
  } = track
  const windData = useSelector(state => selectWindData(state, trackId))
  const menuRef = useRef()
  const fadeRef = useRef()

  useLayoutEffect(() => {
    const menuElement = menuRef.current

    const scrollHandler = e => {
      fadeRef.current.style.opacity =
        e.target.scrollLeft + e.target.clientWidth + 18 < e.target.scrollWidth ? 1 : 0
    }

    menuElement.addEventListener('scroll', scrollHandler)

    return () => menuElement.removeEventListener('scroll', scrollHandler)
  }, [])

  const buildLink = pathname => location => ({ pathname, state: location.state })

  return (
    <div className={styles.container}>
      <div className={styles.fade} ref={fadeRef} />
      <ul className={styles.menu} ref={menuRef}>
        <li className={styles.menuItem}>
          <NavLink exact to={buildLink(`/tracks/${trackId}`)}>
            <ChartIcon />
            {t('tracks.show.charts')}
          </NavLink>
        </li>
        {hasVideo ? (
          <li className={styles.menuItem}>
            <NavLink to={buildLink(`/tracks/${trackId}/video`)}>
              <VideoIcon />
              {t('tracks.show.video')}
            </NavLink>
          </li>
        ) : (
          canEdit && (
            <li className={styles.menuItem}>
              <NavLink to={buildLink(`/tracks/${trackId}/video/edit`)}>
                <VideoIcon />
                {t('tracks.show.video')}
              </NavLink>
            </li>
          )
        )}
        <li className={styles.menuItem}>
          <NavLink to={buildLink(`/tracks/${trackId}/map`)}>
            <MapsIcon />
            Google maps
          </NavLink>
        </li>
        <li className={styles.menuItem}>
          <NavLink to={buildLink(`/tracks/${trackId}/globe`)}>
            <MapsIcon />
            3D maps
          </NavLink>
        </li>
        <li className={styles.menuItem}>
          <NavLink to={buildLink(`/tracks/${trackId}/results`)}>
            <ListIcon />
            {t('tracks.show.results')}
          </NavLink>
        </li>
        {windData.length > 0 && (
          <li className={styles.menuItem}>
            <NavLink to={buildLink(`/tracks/${trackId}/wind_data`)}>
              <WindIcon />
              {t('events.show.weather_data')}
            </NavLink>
          </li>
        )}

        <li className={styles.spacer}>&nbsp;</li>
      </ul>
    </div>
  )
}

Navbar.propTypes = {
  track: PropTypes.shape({
    id: PropTypes.number.isRequired,
    hasVideo: PropTypes.bool.isRequired,
    permissions: PropTypes.shape({
      canEdit: PropTypes.bool.isRequired
    }).isRequired
  })
}

export default Navbar