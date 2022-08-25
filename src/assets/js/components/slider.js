window.addEventListener('load', () => {
	const slider = document.querySelector('.slider')
	const sliderInner = document.querySelector('.slider__inner')
	let slidesArrs = []

	document.querySelectorAll('.slider__row')
		.forEach(row => {
			slidesArrs.push([...row.querySelectorAll('.slide')])
		})
		
	let animation = requestAnimationFrame(moveTrack)

	
	sliderInner.addEventListener('mouseover', function() {
		console.log(123)

		cancelAnimationFrame(animation)
	})
	sliderInner.addEventListener('mouseout', function() {
		animation = requestAnimationFrame(moveTrack)
	})

	const sliderWidth = slider.clientWidth
	const startTrackPos = 150
	let trackPos = startTrackPos
	let cloneOn = 0
	
	function moveTrack(timestamp) {
		let track = document.querySelector('.slider__track')
		trackPos = startTrackPos + timestamp / 10
	
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

	cloneSlides()
})

