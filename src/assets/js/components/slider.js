window.addEventListener('load', () => {
	const slider = document.querySelector('.slider') // Главный элемент слайдера
	const sliderInner = document.querySelector('.slider__inner') // Содержимое слайдера
	let slidesArrs = [] // массив со всеми массивами слайдов row-контейнеров
	let track = document.querySelector('.slider__track')

	// Наполняем slidesArrs данными
	document.querySelectorAll('.slider__row')
		.forEach(row => {
			slidesArrs.push([...row.querySelectorAll('.slide')])
		})

	let baseSlidesWidth = []

	slidesArrs.forEach(row => {
		let slidesWidth = 0

		row.forEach((item, i) => {
			if (i < row.length) {
				slidesWidth += outerElemWidth(item)
			}
		})

		baseSlidesWidth.push(slidesWidth)
	})

	baseSlidesWidth = Math.max(...baseSlidesWidth)

	// Добавляем события ховера на все слайды
	slidesArrs.forEach(slides => {
		slides.forEach(slide => {
			// slide.classList.add('slide_unhover')
			slide.addEventListener('mouseover', slideHoverListener)
			slide.addEventListener('mouseout', slideHoverListener)
		})
	})
	
	// Переменная анимации сдвига слайдов
	let animation = requestAnimationFrame(moveTrack)
	
	// Останавливаем анимацию при ховере на слайдер
	sliderInner.addEventListener('mouseover', function() {
		cancelAnimationFrame(animation)
	})
	// Возобновляем анимацию после прекращения ховера
	sliderInner.addEventListener('mouseout', function() {
		animation = requestAnimationFrame(moveTrack)

		sliderInner.removeEventListener('mousemove', dragTrack)

		dragData = {
			startPos: null,
			translateStart: null
		}
	})


	// Добавляем события для отслеживания перемещения мышкой
	sliderInner.addEventListener('mousedown', function(e) {
		sliderInner.addEventListener('mousemove', dragTrack)
	})
	// Убираем событие
	sliderInner.addEventListener('mouseup', function() {
		sliderInner.removeEventListener('mousemove', dragTrack)

		dragData = {
			startPos: null,
			translateStart: null
		}
	})

	const sliderWidth = slider.clientWidth // базовая ширина слайдерв
	const startTrackPos = 6000 // Стартовая позиция слайдерв
	let trackPos = startTrackPos // позиция слайдерв
	let cloneOn = 0 // Склонировано на это позиции
	let oldTimestamp = 0
	
	function moveTrack(timestamp) {
		

		if (timestamp >= oldTimestamp + 1000 / 60) {
			trackPos += 1.5
			oldTimestamp = timestamp
		}
	
		if ((Math.round(trackPos) - cloneOn >= sliderWidth)) {
			cloneSlides()
			cloneOn = trackPos
		}
	
		track.style.transform = `translateX(-${trackPos}px)`
		// track.style.marginLeft = `-${trackPos}px`
	
		animation = requestAnimationFrame(moveTrack)
	}

	function cloneSlides() {

		document.querySelectorAll('.slider__row')
			.forEach((row, i) => {
				slidesArrs[i].forEach((slide, index) => {
					let cloneSlide = slide.cloneNode(true)
					cloneSlide.classList.add('slide_clone')
					cloneSlide.addEventListener('mouseover', slideHoverListener)
					cloneSlide.addEventListener('mouseout', slideHoverListener)
	
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
			const movement = e.movementX

			let track = document.querySelector('.slider__track')
			let moveTo = -(e.pageX - dragData.startPos.x)
			trackPos = dragData.translateStart + moveTo

			if ((Math.round(trackPos) - cloneOn >= sliderWidth)) {
				cloneSlides()
				cloneOn = trackPos
			}

			track.style.transform = `translateX(-${trackPos}px)`
			// track.style.marginLeft = `-${trackPos}px`

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

	let slideTimer = null

	function slideHoverListener() {
		if (this.classList.contains('slide_hover')) {
			this.classList.remove('slide_hover')
			this.classList.add('slide_unhover')

			// document.querySelectorAll('.slider__row')[1]
			// 	.classList.remove('slider__row_item-hover')

			slideTimer = setTimeout(() => {
				this.classList.remove('slide_unhover')
			}, 300)
		} else {
			this.style.zIndex = 3

			this.classList.add('slide_hover')
			this.classList.remove('slide_unhover')

			// document.querySelectorAll('.slider__row')[1]
			// 	.classList.add('slider__row_item-hover')

			slideTimer = setTimeout(() => {
				this.classList.remove('slide_unhover')
				this.style.zIndex = null
				// document.querySelectorAll('.slider__row')[1]
				// 	.classList.remove('slider__row_item-hover')
			}, 300)
		}
	}

	cloneSlides()
	cloneSlides()
	cloneSlides()
	cloneSlides()
	cloneSlides()
	cloneSlides()
})

function outerElemWidth(elem) {
	var marginLeft = parseInt(getComputedStyle(elem, true).marginLeft);
	var marginRight = parseInt(getComputedStyle(elem, true).marginRight);

	return elem.offsetWidth + marginLeft + marginRight
}

