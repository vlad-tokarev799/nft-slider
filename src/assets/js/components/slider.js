window.addEventListener('load', () => {
	const slider = document.querySelector('.slider')
	const sliderInner = document.querySelector('.slider__inner')
	let slidesArrs = []

	document.querySelectorAll('.slider__row')
		.forEach(row => {
			slidesArrs.push([...row.querySelectorAll('.slide')])
		})

	slidesArrs.forEach(slides => {
		slides.forEach(slide => {
			slide.addEventListener('mouseover', e => {
				document.querySelector('.slider')
					.classList.add('slider_hover')
			})
			slide.addEventListener('mouseout', e => {
				document.querySelector('.slider')
					.classList.remove('slider_hover')
			})
		})
	})
		
	let animation = requestAnimationFrame(moveTrack)

	
	sliderInner.addEventListener('mouseover', function() {
		cancelAnimationFrame(animation)
	})
	sliderInner.addEventListener('mouseout', function() {
		animation = requestAnimationFrame(moveTrack)
	})
	sliderInner.addEventListener('mousedown', function(e) {
		sliderInner.addEventListener('mousemove', dragTrack)
	})
	sliderInner.addEventListener('mouseup', function() {
		sliderInner.removeEventListener('mousemove', dragTrack)

		dragData = {
			startPos: null,
			translateStart: null
		}
	})

	const sliderWidth = slider.clientWidth
	const startTrackPos = 150
	let trackPos = startTrackPos
	let cloneOn = 0
	let oldTimestamp = 0
	
	function moveTrack(timestamp) {
		let track = document.querySelector('.slider__track')

		if (timestamp >= oldTimestamp + 1000 / 60) {
			trackPos += 1.5
			oldTimestamp = timestamp
		}
	
		if ((Math.round(trackPos) - cloneOn >= sliderWidth)) {
			cloneSlides()
			cloneOn = trackPos
		}
	
		track.style.transform = `translateX(-${trackPos}px)`
	
		animation = requestAnimationFrame(moveTrack)
	}
	
	function cloneSlides() {
		document.querySelectorAll('.slider__row')
			.forEach((row, i) => {
				slidesArrs[i].forEach(slide => {
					let cloneSlide = slide.cloneNode(true)
					cloneSlide.classList.add('slide_clone')
	
					row.insertAdjacentElement('beforeend', cloneSlide)
				})
			})
	}

	let dragData = {
		startPos: null,
		translateStart: null,
	}

	function dragTrack(e) {
		if (dragData.startPos) {
			const movement = e.movementX < 0 ? -e.movementX : e.movementX
			// console.log(movement * 0.1)

			let track = document.querySelector('.slider__track')
			let moveTo = -(e.pageX - dragData.startPos.x)
			// moveTo *= movement * 0.1

			trackPos = dragData.translateStart + moveTo
			
			if ((Math.round(trackPos) - cloneOn >= sliderWidth)) {
				cloneSlides()
				cloneOn = trackPos
			}

			track.style.transform = `translateX(-${trackPos}px)`

		} else {
			dragData = {
				startPos: {
					x: e.pageX,
					y: e.pageY
				},
				translateStart: trackPos
			}
		}
	}

	cloneSlides()
})

